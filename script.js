document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('webcam');
    const overlay = document.getElementById('overlay');
    const overlayCtx = overlay.getContext('2d');
    const webcamButton = document.getElementById('webcamButton');
    const toggleDetectionButton = document.getElementById('toggleDetection');
    const snapshotButton = document.getElementById('snapshotButton');
    const recordButton = document.getElementById('recordButton');
    const stopRecordButton = document.getElementById('stopRecordButton');
    const modelSelector = document.getElementById('modelSelector');
    const frameRateDisplay = document.getElementById('frameRate');
    const detectionCountDisplay = document.getElementById('detectionCount');
    const darkModeToggle = document.getElementById('toggleDarkMode');
    const snapshotCanvas = document.getElementById('snapshotCanvas');
    const snapshotCtx = snapshotCanvas.getContext('2d');
    const downloadLink = document.getElementById('downloadLink');
    const alertSound = document.getElementById('alertSound');
    const bboxList = document.getElementById('bboxList');
  
    let model = null;
    let isDetecting = false;
    let recording = false;
    let mediaRecorder;
    let recordedChunks = [];
    let lastFrameTime = performance.now();
  
    // Toggle dark/light mode
    darkModeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
    });
  
    // Load the object detection model
    async function loadModel() {
      const selectedModel = modelSelector.value;
      if (selectedModel === 'coco-ssd') {
        model = await cocoSsd.load();
      } else {
        // Future model support: fallback to coco-ssd
        model = await cocoSsd.load();
      }
      console.log('Model loaded.');
    }
  
    // Enable webcam and load the model
    async function enableWebcam() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Webcam not supported in this browser.');
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        await loadModel();
        // Start processing frames once the model is loaded
        requestAnimationFrame(processFrame);
      } catch (error) {
        console.error('Error accessing webcam:', error);
      }
    }
  
    webcamButton.addEventListener('click', () => {
      enableWebcam();
      webcamButton.disabled = true;
    });
  
    // Toggle detection on/off
    toggleDetectionButton.addEventListener('click', () => {
      isDetecting = !isDetecting;
      toggleDetectionButton.textContent = isDetecting ? 'Disable Detection' : 'Enable Detection';
    });
  
    // Process each video frame and run object detection if enabled
    async function processFrame() {
      // Calculate and display FPS
      const now = performance.now();
      const delta = now - lastFrameTime;
      const fps = 1000 / delta;
      frameRateDisplay.textContent = fps.toFixed(1);
      lastFrameTime = now;
  
      // Clear the overlay canvas and detection list for the new frame
      overlayCtx.clearRect(0, 0, overlay.width, overlay.height);
      bboxList.innerHTML = '';
  
      if (isDetecting && model) {
        const predictions = await model.detect(video);
        detectionCountDisplay.textContent = predictions.length;
  
        // Play alert sound if objects are detected (debounce if needed)
        if (predictions.length > 0) {
          alertSound.play();
        }
  
        // Draw bounding boxes, labels, and coordinates; also update detection details list
        predictions.forEach((pred, index) => {
          // Get bbox coordinates
          const [x, y, width, height] = pred.bbox;
  
          // Draw bounding box on canvas
          overlayCtx.strokeStyle = 'lime';
          overlayCtx.lineWidth = 2;
          overlayCtx.strokeRect(x, y, width, height);
  
          // Draw primary label text (class and score)
          const labelText = `${pred.class} ${(pred.score * 100).toFixed(1)}%`;
          overlayCtx.fillStyle = 'lime';
          overlayCtx.font = '18px Arial';
          overlayCtx.fillText(labelText, x, y > 20 ? y - 5 : 20);
  
          // Draw bounding box coordinate text below the bounding box
          const coordText = `x: ${x.toFixed(0)}, y: ${y.toFixed(0)}, w: ${width.toFixed(0)}, h: ${height.toFixed(0)}`;
          overlayCtx.font = '14px Arial';
          overlayCtx.fillText(coordText, x, y + height + 15);
  
          // Update the detection details list in the UI
          const listItem = document.createElement('li');
          listItem.textContent = `${index + 1}. ${pred.class} (${(pred.score * 100).toFixed(1)}%) — ${coordText}`;
          bboxList.appendChild(listItem);
        });
      } else {
        detectionCountDisplay.textContent = '0';
      }
  
      // Continue processing frames
      requestAnimationFrame(processFrame);
    }
  
    // Take a snapshot by combining the video and overlay layers
    snapshotButton.addEventListener('click', () => {
      snapshotCtx.drawImage(video, 0, 0, snapshotCanvas.width, snapshotCanvas.height);
      snapshotCtx.drawImage(overlay, 0, 0, snapshotCanvas.width, snapshotCanvas.height);
      // Set the snapshot download link
      downloadLink.href = snapshotCanvas.toDataURL('image/png');
    });
  
    // Video recording functionality using MediaRecorder API
    recordButton.addEventListener('click', () => {
      const stream = video.srcObject;
      if (!stream) return;
      recordedChunks = [];
      try {
        mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });
      } catch (e) {
        console.error('MediaRecorder not supported with specified options, trying default.', e);
        mediaRecorder = new MediaRecorder(stream);
      }
      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunks.push(e.data);
        }
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'recording.webm';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 100);
      };
      mediaRecorder.start();
      recording = true;
      recordButton.disabled = true;
      stopRecordButton.disabled = false;
    });
  
    // Stop recording video
    stopRecordButton.addEventListener('click', () => {
      if (mediaRecorder && recording) {
        mediaRecorder.stop();
        recording = false;
        recordButton.disabled = false;
        stopRecordButton.disabled = true;
      }
    });
  });
  