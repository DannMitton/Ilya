# Voice staves per page, by eye from sheets2/ (r4 harness). Default: every third staff from 0.
OVR = {
 'k04-p-3': [0, 5, 8], 'k07-p-3': [4, 7], 'k09-p-2': [0, 3, 6, 9],
 'sun3-x-07': [0, 3, 6], 'sun3-x-08': [0, 4, 7],
 'sun5-x-12': [0, 3, 5, 7], 'sun5-x-13': [0, 2, 5], 'sun5-x-14': [0, 2, 4],
 'sun5-x-15': [0, 3, 6], 'sun5-x-16': [0, 2, 4, 6],
 'sun6-x-21': [0, 2, 4, 7], 'sun6-x-22': [0, 3, 5, 8], 'tch-p-2': [1, 4, 7, 10],
}
def voices(name, n):
    if name in OVR: return OVR[name]
    return list(range(0, n - 2, 3)) if n >= 3 else []
SONGS = ['tch','sun1','sun4','sun5','sun6','k01','k02','k03','k04','k06','k07','k08','k09','k10','gur','grech','varl']
EXTRA = ['sun2','sun3']
def song_of(page): return page.split('-')[0]
