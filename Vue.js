new Vue({
    el: '#app',
    data: {
        showCamera: false,
        cameraMessage: '请点击拍照',
        photoTaken: false,
        photoSrc: '',
        records: []
    },
    methods: {
        back() {
            this.showCamera = false;
            this.photoTaken = false;
        },
        async capturePhoto() {
            const video = document.querySelector('video');
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0);
            this.photoSrc = canvas.toDataURL('image/png');
            this.photoTaken = true;
            this.cameraMessage = '是否重新拍摄或发送？';
        },
        async sendPhoto() {
            this.showCamera = false;
            const response = await fetch('/api/process-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    image: this.photoSrc
                })
            });
            const data = await response.json();
            this.records.push({ image: this.photoSrc, text: data.description, audio: data.audio });
            this.photoTaken = false;
            this.playAudio(data.audio);
        },
        playAudio(audioUrl) {
            const audio = new Audio(audioUrl);
            audio.play();
        },
        scrollTop() {
            window.scrollTo(0, 0);
        }
    }
});
