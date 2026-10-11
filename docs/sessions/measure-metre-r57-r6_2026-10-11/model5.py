import torch, torch.nn as nn
def blk(i, o):
    return nn.Sequential(nn.Conv2d(i, o, 3, padding=1), nn.BatchNorm2d(o), nn.ReLU(), nn.Conv2d(o, o, 3, padding=1), nn.BatchNorm2d(o), nn.ReLU(), nn.MaxPool2d(2))
class NetA(nn.Module):
    """Round 4's network: 32 by 32 at 10 px a space."""
    CW, SP, FEAT = 32, 10, 96
    def __init__(s, n=13):
        super().__init__()
        s.f = nn.Sequential(blk(1, 16), blk(16, 32), blk(32, 64))
        s.p = nn.Sequential(nn.Flatten(), nn.Dropout(0.3), nn.Linear(64 * 16, 96), nn.ReLU())
        s.o = nn.Sequential(nn.Dropout(0.3), nn.Linear(96, n))
    def forward(s, x, feats=False):
        z = s.p(s.f(x)); y = s.o(z)
        return (y, z) if feats else y
class NetB(nn.Module):
    """40 by 40 at 12 px a space: finer detail over about the same 3.3 spaces."""
    CW, SP, FEAT = 40, 12, 64
    def __init__(s, n=13):
        super().__init__()
        s.f = nn.Sequential(blk(1, 16), blk(16, 32), blk(32, 64))
        s.p = nn.Sequential(nn.Flatten(), nn.Dropout(0.3), nn.Linear(64 * 25, 64), nn.ReLU())
        s.o = nn.Sequential(nn.Dropout(0.3), nn.Linear(64, n))
    def forward(s, x, feats=False):
        z = s.p(s.f(x)); y = s.o(z)
        return (y, z) if feats else y
def prep(x):
    return (1.0 - torch.as_tensor(x, dtype=torch.float32) / 255.0).unsqueeze(1)
if __name__ == '__main__':
    for N in (NetA, NetB): print(N.__name__, sum(p.numel() for p in N().parameters()))
