import sys, glob, os, re, subprocess, soundfile as sf, sherpa_onnx
def mk(d,n): return sherpa_onnx.OfflineRecognizer.from_whisper(encoder=f"{d}/{n}-encoder.int8.onnx", decoder=f"{d}/{n}-decoder.int8.onnx", tokens=f"{d}/{n}-tokens.txt", language="en", num_threads=8, tail_paddings=1000)
recs={"M":mk("sherpa-onnx-whisper-medium.en","medium.en"),"S":mk("sherpa-onnx-whisper-small.en","small.en")}
for f in sorted(glob.glob("fujisawa/wav/*.wav")):
    a, sr = sf.read(f, dtype="float32"); dur=len(a)/sr
    out=subprocess.run(["ffmpeg","-i",f,"-af","silencedetect=noise=-35dB:d=0.7","-f","null","-"],capture_output=True,text=True).stderr
    st=[float(x) for x in re.findall(r"silence_start: ([\d.]+)",out)]; en=[float(x) for x in re.findall(r"silence_end: ([\d.]+)",out)]
    # speech segments = complement of silences
    segs=[]; cur=0.0
    for s,e in zip(st,en+[dur]*(len(st)-len(en))):
        if s-cur>0.2: segs.append((cur,s))
        cur=e
    if dur-cur>0.2: segs.append((cur,dur))
    print("=====",os.path.basename(f),f"{dur:.1f}s")
    prev=0.0
    for s,e in segs:
        gap=s-prev; prev=e
        line=[]
        for k,r in recs.items():
            x=r.create_stream(); x.accept_waveform(sr,a[int(max(0,s-0.15)*sr):int(min(dur,e+0.15)*sr)]); r.decode_stream(x); line.append(f"{k}: {x.result.text.strip()}")
        print(f"  [{s:5.1f}-{e:5.1f}] (pause before {gap:4.1f}s)  " + "  //  ".join(line))
