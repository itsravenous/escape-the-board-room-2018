export default ({onDetectNote, onMicError, onMicSuccess}) => {

  var context = new(window.AudioContext || window.webkitAudioContext)();
  var analyser = context.createAnalyser();
  var frequencyData;

  function successCallback(stream) {
    var microphone = context.createMediaStreamSource(stream);
    microphone.connect(analyser);
    frequencyData = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(frequencyData);
    onMicSuccess();
  }
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  navigator.getUserMedia({
    audio: true
  }, successCallback, onMicError);
  var octave;
  var cents;
  var noteName;

  function compileFreq(frequency) {
    var noteNames = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
    var linear = Math.log(frequency / 440.0) / Math.log(2) + 4.0;
    octave = Math.floor(linear);
    cents = 1200 * (linear - octave);
    var noteNum = Math.floor(cents / 100) % 12;
    cents -= noteNum * 100;
    if (cents > 50) {
      cents -= 100;
      if (++noteNum > 11) noteNum -= 12;
    }
    noteName = noteNames[noteNum];
    if (noteName != 'A' && noteName != 'A#' && noteName != 'B')
      octave++;
  }
  var buflen = 2048;
  var buf = new Float32Array(buflen);
  var MIN_SAMPLES = 0;

  function autoCorrelate(buf, sampleRate) {
    var SIZE = buf.length;
    var MAX_SAMPLES = Math.floor(SIZE / 2);
    var best_offset = -1;
    var best_correlation = 0;
    var rms = 0;
    var foundGoodCorrelation = false;
    var correlations = new Array(MAX_SAMPLES);
    for (var i = 0; i < SIZE; i++) {
      var val = buf[i];
      rms += val * val;
    }
    rms = Math.sqrt(rms / SIZE);
    if (rms < 0.01)
      return -1;
    var lastCorrelation = 1;
    for (var offset = MIN_SAMPLES; offset < MAX_SAMPLES; offset++) {
      var correlation = 0;
      for (var i = 0; i < MAX_SAMPLES; i++) {
        correlation += Math.abs((buf[i]) - (buf[i + offset]));
      }
      correlation = 1 - (correlation / MAX_SAMPLES);
      correlations[offset] = correlation;
      if ((correlation > 0.9) && (correlation > lastCorrelation)) {
        foundGoodCorrelation = true;
        if (correlation > best_correlation) {
          best_correlation = correlation;
          best_offset = offset;
        }
      } else if (foundGoodCorrelation) {
        var shift = (correlations[best_offset + 1] - correlations[best_offset - 1]) / correlations[best_offset];
        return sampleRate / (best_offset + (8 * shift));
      }
      lastCorrelation = correlation;
    }
    if (best_correlation > 0.01)
      return sampleRate / best_offset;
    return -1;
  }

  function update() {
    analyser.getFloatTimeDomainData(buf);
    var pitch = autoCorrelate(buf, context.sampleRate);
    if (pitch > -1) {
      compileFreq(pitch);
      onDetectNote(noteName);
    }
    setTimeout(function () {
      requestAnimationFrame(update);
    }, 100);
  }
  analyser.fftSize = 512;
  var bufferLength = analyser.frequencyBinCount;
  var dataArray = new Uint8Array(bufferLength);

  var lockedNotes = [];
  var completed = false;
  requestAnimationFrame(update);
};
