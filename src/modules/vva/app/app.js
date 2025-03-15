import { LightningElement, track } from 'lwc';

export default class VideoVault extends LightningElement {
    @track fileName = '';
    @track fileData;

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

    handleUpload(){
        fetch("http://localhost:3001/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                fileName: this.fileName,
                fileType: "video/mp4",
                fileData: this.fileData
            })
        })
        .then(response => response.json())
        .then(result => {
            console.log("Upload successful:", result); //TODO: add success notification (lightning base components)?
        })
        .catch(error => {
            console.error("Error uploading file:", error);
        });
    }
}
