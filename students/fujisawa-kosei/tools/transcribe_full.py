import sys, glob, os, soundfile as sf, sherpa_onnx
d=sys.argv[1]; name=sys.argv[2]
rec = sherpa_onnx.OfflineRecognizer.from_whisper(
    encoder=f"{d}/{name}-encoder.int8.onnx", decoder=f"{d}/{name}-decoder.int8.onnx",
    tokens=f"{d}/{name}-tokens.txt", language="en", task="transcribe", num_threads=8, tail_paddings=1000)
for f in sorted(glob.glob(sys.argv[3]+"/*.wav")):
    a, sr = sf.read(f, dtype="float32")
    texts=[]
    # chunk at 28s to fit whisper window
    step=sr*28
    for i in range(0, len(a), step):
        s = rec.create_stream(); s.accept_waveform(sr, a[i:i+step]); rec.decode_stream(s); texts.append(s.result.text.strip())
    print("=====", os.path.basename(f), f"{len(a)/sr:.1f}s"); print(" | ".join(texts))
