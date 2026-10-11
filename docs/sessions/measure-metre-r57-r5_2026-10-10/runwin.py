import numpy as np, json, torch
from pages import crops_at
from train import predict
STEP = 0.2
def window_probs(net, w):
    sp = w['space']
    xs = np.arange(w['x0'], w['x1'], STEP * sp)
    C = crops_at(w['page'], w['staff'], xs)
    P = predict(net, C.reshape(-1, 32, 32)).reshape(len(xs), 3, 13)
    return xs, P
