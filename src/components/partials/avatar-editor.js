import React from 'react';
import AvatarEditor from 'react-avatar-editor'
import request from 'controllers/request'

class MyAvatar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            src: null,
            selectedImage: false,
            canvas: false,
            loading: false,
            success: false,
            error: false,
            message: false

        }
    }

    onClickSave = () => {
        let vm = this;

        if (this.editor) {
            // This returns a HTMLCanvasElement, it can be made into a data URL or a blob,
            // drawn on another canvas, or added to the DOM.
            const canvas = this.editor.getImage()

            if (canvas.toBlob) {
                canvas.toBlob(
                    function (blob) {
                        // Do something with the blob object,
                        // e.g. creating a multipart form for file uploads:
                        let formData = new FormData();
                        formData.append('avatar', blob, 'avatarImage');
                        //vm.setState({ loading: true, error: false })
                        request.post(`users/profile/avatar`, formData, function (payload, status) {
                            if (status === 200) {
                                vm.setState({ loading: false, success: true, message: 'Profil fotoğrafı yüklendi' });
                                window.location.reload();
                            }
                            else {
                                vm.setState({ loading: false, error: true, message: 'Bir hata oluştu' });
                            }

                        }, { excludeApiPath: false });
                    },
                    'image/jpeg'
                );
            }
            this.setState({
                canvas: canvas
            })

        }
    }

    onSelectFile = e => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader()
            reader.addEventListener('load', () => this.setState({ src: reader.result }))
            reader.readAsDataURL(e.target.files[0])
            this.setState({ selectedImage: e.target.files[0] })
        }
    }

    setEditorRef = (editor) => this.editor = editor

    render() {
        let vm = this;
        let image = vm.state.selectedImage;

        return (
            <React.Fragment>
                <input type="file" onChange={this.onSelectFile} value="" />
                {
                    image && (
                        <AvatarEditor
                            ref={this.setEditorRef}
                            image={image}
                            width={120}
                            height={120}
                            border={20}
                            color={[255, 255, 255, 0.6]} // RGBA
                        />
                    )
                }
                <button onClick={this.onClickSave}>SAVE</button>
            </React.Fragment>


        )
    }
}
export default MyAvatar
