# Step 3, third part: the supplement for ѳ and ѵ, the train / held-out choice, and the counts. Outputs outside the tree.
import importlib.util, json, os, re, random, collections, sys, hashlib
here=os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0,here)
spec=importlib.util.spec_from_file_location('bt',here+'/build-text.py'); bt=importlib.util.module_from_spec(spec); spec.loader.exec_module(bt)
import common as C
D=bt.D; rng=random.Random(8201)
pool=json.load(open(D+'/lines_pool.json')); sup=json.load(open(D+'/lines_supplement.json')); ex=json.load(open(D+'/exclusion_sets.json'))
ex4=set(ex['ex4']); titles=set(ex['titles'])
def words_of(s): return bt.nwords(s)
def g4(s):
    ws=words_of(s); C.prime(ws); ws=[C.norm(w) for w in ws]; ws=[w for w in ws if w]
    return {' '.join(ws[i:i+4]) for i in range(len(ws)-3)}
def tn(t):
    ws=words_of(re.sub(r'\(.*?\)|/ДО','',t)); C.prime(ws); return ' '.join(C.norm(w) for w in ws)
rep=collections.OrderedDict()
def hold_author(a): return int(hashlib.md5(a.encode()).hexdigest(),16)%10==0
allw=sorted({w for x in sup for w in words_of(x[0])}); C.prime(allw)
sup2=[];dr=collections.Counter(); seen={x[0].lower() for x in pool['train']+pool['hold']}
for x in sup:
    if tn(x[1]) in titles: dr['page title equals a listed title']+=1; continue
    if g4(x[0])&ex4: dr['line holds an excluded four-word run']+=1; continue
    if x[0].lower() in seen: dr['already in the pool']+=1; continue
    seen.add(x[0].lower()); sup2.append(x)
rep['supplement lines after exclusions']=len(sup2); rep['supplement drops']=dict(dr)
def cnt(l): return dict(ѣ=l.count('ѣ'),ѳ=l.count('ѳ')+l.count('Ѳ'),ѵ=l.count('ѵ')+l.count('Ѵ'),і=l.count('і')+l.count('І'),finalъ=len(re.findall(r'ъ(?![а-яѣѳѵі])',l)))
# real supplement lines, by letter
th=[x for x in sup2 if not hold_author(x[2])]; hh=[x for x in sup2 if hold_author(x[2])]
rep['supplement real lines: train authors / held-out authors']=[len(th),len(hh)]
tot=collections.Counter()
for x in th:
    for k,v in cnt(x[0]).items(): tot['real '+k]+=v
rep['real supplement letter counts, train']=dict(tot)
# lexicons of real old-spelling words (Code's list; each is an attested pre-1918 spelling)
FITA=['Ѳедоръ','Ѳома','Ѳеодоръ','Ѳеодосій','Агаѳья','Марѳа','Аѳины','ариѳметика','миѳъ','ѳеатръ','ѳиміамъ','Ѳеофанъ','Аѳонъ','каѳедра','эѳиръ','Эѳіопія','Ѳиваида','ѳита','Ѳекла','Ѳеофилъ','логариѳмъ','Іоаннъ Ѳеологъ','ритмъ']
IZH=['мѵро','мѵроносица','мѵропомазаніе','Ѵпсиланти','ѵпсилонъ','Сѵрія','Кѵръ','Ѵпатъ','Ѵпсилантіи','Ѵпсиланти','Асѵръ','Сѵмеонъ','Ѵ','ѵ','мѵрру']
def count_letter(lines,ch): return sum(l.lower().count(ch) for l in lines)
def synth(base,words,n,letter):
    out=[]
    while len(out)<n:
        b=rng.choice(base)[0].split()
        for _ in range(rng.choice([1,2,2,3])):
            i=rng.randrange(len(b)+1); b.insert(i,rng.choice(words))
        out.append(' '.join(b)[:78])
    return out

# ---- the training set: 20,000 main lines + added lines for ѳ and ѵ (under 10 percent of the corpus)
main=rng.sample(pool['train'],22000)
train=[(x[0],'main') for x in main]
added=[]
v_real=[x for x in th if re.search('[ѵѴ]',x[0])]; rng.shuffle(v_real)
for x in v_real[:400]: added.append((x[0],'added: real line holding ѵ'))
def ntot(ls,ch): return sum(l.count(ch)+l.count(ch.upper()) for l,_ in ls)
f_real=[x for x in th if re.search('[ѳѲ]',x[0]) and not re.search('[ѵѴ]',x[0])]; rng.shuffle(f_real); f_real.sort(key=lambda x:-(x[0].count('ѳ')+x[0].count('Ѳ')))
for x in f_real:
    if ntot(train+added,'ѳ')>=2050: break
    added.append((x[0],'added: real line holding ѳ'))
base=[x for x in pool['train']]
need=2200-ntot(train+added,'ѵ')
nsy=0
while ntot(train+added,'ѵ')<2050:
    b=rng.choice(base)[0].split()
    for _ in range(3): b.insert(rng.randrange(len(b)+1),rng.choice(IZH[:7]))
    added.append((' '.join(b)[:78],'added: synthetic, real line with real ѵ words inserted')); nsy+=1
train+=added
rep['training lines: main / added']=[len(main),len(added)]
rep['added lines as a share of the corpus']=round(len(added)/len(train),4)
rep['added by kind']=dict(collections.Counter(k for _,k in added))
tc=collections.Counter()
for l,_ in train:
    for k,v in cnt(l).items(): tc[k]+=v
rep['training letter counts']=dict(tc)
# ---- held-out: 500 main lines from authors never trained on, plus added lines for ѳ and ѵ
hmain=rng.sample(pool['hold'],500); held=[(x[0],'main') for x in hmain]; hadd=[]
hf=[x for x in hh if re.search('[ѳѲ]',x[0])]; rng.shuffle(hf)
for x in hf:
    if ntot(held+hadd,'ѳ')>=130: break
    hadd.append((x[0],'added: real line holding ѳ'))
hv=[x for x in hh if re.search('[ѵѴ]',x[0])]
for x in hv: hadd.append((x[0],'added: real line holding ѵ'))
while ntot(held+hadd,'ѵ')<130:
    b=rng.choice(pool['hold'])[0].split()
    for _ in range(rng.choice([1,2,2])): b.insert(rng.randrange(len(b)+1),rng.choice(IZH[:7]))
    hadd.append((' '.join(b)[:78],'added: synthetic, real line with real ѵ words inserted'))
held+=hadd
hc=collections.Counter()
for l,_ in held:
    for k,v in cnt(l).items(): hc[k]+=v
rep['held-out lines: main / added']=[len(hmain),len(hadd)]
rep['held-out letter counts']=dict(hc)
# no held-out line may equal a training line
tset={l.lower() for l,_ in train}; held=[(l,k) for l,k in held if l.lower() not in tset]
rep['held-out lines after removing any that equal a training line']=len(held)
# sources
src=collections.Counter()
for x in main: src[(x[3]<1946)]+=1
rep['training lines: distinct pages']=len({x[4] for x in main}); rep['training lines: distinct authors']=len({x[2] for x in main})
rep['held-out lines: distinct authors']=len({x[2] for x in hmain})
json.dump([[f'tr{i:05d}',l,k] for i,(l,k) in enumerate(train)],open(D+'/train_lines.json','w'),ensure_ascii=False)
json.dump([[f'ho{i:04d}',l,k] for i,(l,k) in enumerate(held)],open(D+'/held_lines.json','w'),ensure_ascii=False)
json.dump(rep,open(D+'/assemble_report.json','w'),ensure_ascii=False,indent=1)
print(json.dumps(rep,ensure_ascii=False,indent=1))
