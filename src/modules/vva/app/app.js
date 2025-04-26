import { LightningElement, track } from 'lwc';

export default class VideoVault extends LightningElement {
    @track fileName = '';
    @track fileData;
    @track videos = [];
    @track errorList;
    @track selectedVideo;


    connectedCallback() {
        this.loadVideos();
    }


    handleFileChange(event) {
        const file = event.target.files[0];
        if (file) {
          this.fileName = file.name;
          const reader = new FileReader();
          reader.onload = () => {
            this.fileData = reader.result;
          };
          reader.readAsDataURL(file);
        }
      }

      async handleUpload() {
        try {
          await fetch("http://172.16.32.32:3001/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fileName: this.fileName,
              fileType: "video/mp4",
              fileData: this.fileData,
            }),
          });
          // Refresh list after successful upload
          this.loadVideos();
        } catch (err) {
          console.error("Error uploading file:", err);
        }
      }

      async loadVideos() {
        try {
          const res = await fetch("http://172.16.32.32:3001/videos");
          if (!res.ok) throw new Error("Fetch error");
          this.videos = await res.json();
          this.errorList = undefined;
        } catch (err) {
          console.error("Error loading videos:", err);
          this.errorList = "Could not load videos.";
        }
      }

      handleSelect(event) {
        const id = event.currentTarget.dataset.id;
        this.selectedVideo = this.videos.find((v) => v.id == id);
      }
    
      get videoSrc() {
        return this.selectedVideo
          ? `http://172.16.32.32:3001/videos/${this.selectedVideo.id}/stream`
          : "";
      }
}
