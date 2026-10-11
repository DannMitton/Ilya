import json, torch, numpy as np, pickle, sys
from model import Net
from runwin import window_probs, STEP
def all_probs(net, W, songs=None):
    out = {}
    for w in W:
        if songs and w['song'] not in songs: continue
        out[w['id']] = window_probs(net, w)
    return out
if __name__ == '__main__':
    net = Net().to('mps'); net.load_state_dict(torch.load(sys.argv[1])); net.eval()
    W = json.load(open('windows.json'))
    pickle.dump(all_probs(net, W), open(sys.argv[2], 'wb'))
