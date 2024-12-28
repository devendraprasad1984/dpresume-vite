obj={1:'dp',2:'hello',3:'kittu'}
nObj={}
for o in obj:
    if o==1: continue
    nObj[o]=obj[o]

print(nObj)
