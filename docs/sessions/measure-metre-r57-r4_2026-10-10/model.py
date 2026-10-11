import torch, torch.nn as nn
class Net(nn.Module):
    def __init__(s, n=13):
        super().__init__()
        def blk(i, o): return nn.Sequential(nn.Conv2d(i, o, 3, padding=1), nn.BatchNorm2d(o), nn.ReLU(), nn.Conv2d(o, o, 3, padding=1), nn.BatchNorm2d(o), nn.ReLU(), nn.MaxPool2d(2))
        s.f = nn.Sequential(blk(1, 16), blk(16, 32), blk(32, 64))
        s.h = nn.Sequential(nn.Flatten(), nn.Dropout(0.3), nn.Linear(64 * 16, 96), nn.ReLU(), nn.Dropout(0.3), nn.Linear(96, n))
    def forward(s, x): return s.h(s.f(x))
def prep(x):  # uint8 (N,32,32) -> float ink
    return (1.0 - torch.as_tensor(x, dtype=torch.float32) / 255.0).unsqueeze(1)
if __name__ == '__main__':
    print(sum(p.numel() for p in Net().parameters()))
