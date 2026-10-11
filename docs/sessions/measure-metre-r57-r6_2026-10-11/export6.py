"""Network A as ONNX for the app, with two outputs: the 13 class probabilities (softmax) and the 96 penultimate
features; and the unfamiliar-shape reference as raw float16 bytes plus its classes.
Input `ink`: (N, 1, 32, 32) float32, ink 0..1 (1 - grey/255), as reading5.cut gives it."""
import pickle, json, os, sys
import numpy as np, torch
from model5 import NetA
D = '../run1'


class Wrap(torch.nn.Module):
    def __init__(s, net):
        super().__init__(); s.net = net
    def forward(s, x):
        y, z = s.net(x, feats=True)
        return torch.softmax(y, 1), z


net = NetA(); net.load_state_dict(torch.load(f'{D}/A.pt', map_location='cpu')); net.eval()
torch.onnx.export(Wrap(net), torch.zeros(4, 1, 32, 32), f'{D}/metre-a.onnx', input_names=['ink'], output_names=['probs', 'feats'],
                  dynamic_axes={'ink': {0: 'n'}, 'probs': {0: 'n'}, 'feats': {0: 'n'}}, opset_version=17, dynamo=False)
F, C = pickle.load(open(f'{D}/refs_80.pkl', 'rb'))['A']
F.astype('<f2').tofile(f'{D}/metre-a-ref.f16'); C.astype(np.uint8).tofile(f'{D}/metre-a-ref.cls')
print({k: os.path.getsize(f'{D}/{k}') for k in ('metre-a.onnx', 'metre-a-ref.f16', 'metre-a-ref.cls')}, F.shape)
