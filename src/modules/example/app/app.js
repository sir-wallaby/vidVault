import { LightningElement, track } from 'lwc';

export default class HelloWorldApp extends LightningElement {
    @track fileName = '';
    @track fileData;
    @track uploadSuccess = false;
    @track uploadError = false;

    handleFileChange(event) {
        const file = event.target.files[0];
        console.error(JSON.stringify(file.size));
        console.error(JSON.stringify(file.type));

        if (file) {
            this.fileName = file.name;
            const reader = new FileReader();
            reader.onload = () => {
                this.fileData = reader.result; // Base64 encoded file data
            };
            reader.readAsDataURL(file); // This stores the file data in base64 format
        }
    }

    handleUpload(){
        console.error(JSON.stringify(this.fileData));
        //console.error('refresh: ' + window.location.reload());
    }
}
