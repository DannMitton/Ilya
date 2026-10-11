"""Nine readings a network: the window's crop grid offset by -0.1, 0, +0.1 of a space, at scales 0.95, 1, 1.05.

Crops are cut on the GPU with grid_sample so the nine readings cost little more than one. A crop at scale s
magnifies the page by s about the crop's centre; output pixel i samples input x + (i - cw/2)/s, which at
s = 1 is exactly crops.crop_norm (cv2.warpAffine), the cut the networks were trained on.
"""
import numpy as np, torch
DEV = 'mps'
OFFSETS = (-0.1, 0.0, 0.1)
SCALES = (0.95, 1.0, 1.05)
READINGS = [(o, s) for o in OFFSETS for s in SCALES]
STEP = 0.2

def cut(img, cx, cy, cw, s):
    """img: (H, W) uint8 numpy; cx, cy: arrays of centres in its pixels. Returns (N, 1, cw, cw) ink tensor."""
    H, W = img.shape
    t = (1.0 - torch.as_tensor(img, dtype=torch.float32, device=DEV) / 255.0)[None, None]
    n = len(cx)
    th = torch.zeros(n, 2, 3, device=DEV)
    th[:, 0, 0] = cw / (s * W); th[:, 1, 1] = cw / (s * H)
    th[:, 0, 2] = torch.as_tensor((2 * np.asarray(cx) + 1 - 1 / s) / W - 1, dtype=torch.float32, device=DEV)
    th[:, 1, 2] = torch.as_tensor((2 * np.asarray(cy) + 1 - 1 / s) / H - 1, dtype=torch.float32, device=DEV)
    grid = torch.nn.functional.affine_grid(th, (n, 1, cw, cw), align_corners=False)
    return torch.nn.functional.grid_sample(t.expand(n, -1, -1, -1), grid, mode='bilinear', padding_mode='zeros', align_corners=False)

@torch.no_grad()
def run_net(net, crops, bs=8192):
    P, F = [], []
    for i in range(0, len(crops), bs):
        y, z = net(crops[i:i + bs], feats=True)
        P.append(torch.softmax(y, 1).cpu().numpy().astype(np.float16)); F.append(z.cpu().numpy().astype(np.float16))
    return np.concatenate(P), np.concatenate(F)

def read_strip(net, img, xs_sp, seat_ys, sp, keepfeat=0.3):
    """One image (a staff band or a rendered staff) at `sp` px a space. xs_sp: base positions in spaces;
    seat_ys(x_sp) -> 3 seat heights in pixels. Returns per reading: probs (N,3,13), sparse feats {(i,seat): vec}."""
    out = []
    for off, s in READINGS:
        xs = np.asarray(xs_sp) + off
        ys = np.array([seat_ys(x) for x in xs])                    # (N, 3)
        cx = np.repeat(xs * sp, 3); cy = ys.reshape(-1)
        cr = cut(img, cx, cy, net.CW, s)
        P, F = run_net(net, cr)
        P = P.reshape(len(xs), 3, 13); F = F.reshape(len(xs), 3, -1)
        pres = 1 - P[:, :, 12].astype(np.float32)
        idx = np.argwhere(pres >= keepfeat)
        out.append(dict(off=off, s=s, xs=xs, P=P, feat={(int(i), int(j)): F[i, j] for i, j in idx}))
    return out
