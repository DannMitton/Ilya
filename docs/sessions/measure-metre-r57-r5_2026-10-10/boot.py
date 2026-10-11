import numpy as np, torch
from train import train
d = np.load('rtrain.npz'); X, Y = d['X'], d['Y']
rng = np.random.default_rng(0)
pos = np.where(Y != 12)[0]; neg = np.where(Y == 12)[0]
idx = np.concatenate([rng.choice(pos, 300000, replace=False), rng.choice(neg, 600000, replace=False)])
net = train(X[idx], Y[idx], epochs=3)
torch.save(net.state_dict(), 'boot.pt')
