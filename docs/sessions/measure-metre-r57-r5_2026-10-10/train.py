import numpy as np, torch, torch.nn as nn, time
from model import Net, prep
DEV = 'mps'
def augment(xb):
    # small brightness/contrast jitter on the fly
    a = torch.empty(xb.shape[0], 1, 1, 1, device=xb.device).uniform_(0.7, 1.2)
    return (xb * a).clamp(0, 1)
def train(X, Y, epochs=4, seed=0, bs=512, lr=2e-3, log=True):
    torch.manual_seed(seed); np.random.seed(seed)
    net = Net().to(DEV)
    opt = torch.optim.AdamW(net.parameters(), lr=lr, weight_decay=1e-4)
    n = len(X); steps = epochs * (n // bs)
    sch = torch.optim.lr_scheduler.OneCycleLR(opt, max_lr=lr, total_steps=steps)
    lossf = nn.CrossEntropyLoss(label_smoothing=0.02)
    Xt = torch.as_tensor(X); Yt = torch.as_tensor(Y.astype(np.int64))
    t = time.time(); k = 0
    for ep in range(epochs):
        perm = torch.randperm(n); net.train(); tot = 0
        for i in range(0, n - bs + 1, bs):
            idx = perm[i:i + bs]
            xb = prep(Xt[idx].numpy()).to(DEV); yb = Yt[idx].to(DEV)
            loss = lossf(net(augment(xb)), yb)
            opt.zero_grad(); loss.backward(); opt.step(); sch.step(); tot += loss.item(); k += 1
        if log: print('  epoch', ep, round(tot / (n // bs), 4), round(time.time() - t), 's', flush=True)
    return net.eval()
@torch.no_grad()
def predict(net, X, bs=4096):
    out = []
    for i in range(0, len(X), bs):
        out.append(torch.softmax(net(prep(X[i:i + bs]).to(DEV)), 1).cpu().numpy())
    return np.concatenate(out) if out else np.zeros((0, 13))
