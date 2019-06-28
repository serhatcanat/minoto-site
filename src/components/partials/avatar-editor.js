import React from 'react';
import AvatarEditor from 'react-avatar-editor'
import Btn from 'components/partials/btn'
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
            message: false,
            submitting: false,
            scale: 1

        }
    }


    handleScale = e => {
        const scale = parseFloat(e.target.value)
        this.setState({ scale })
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
                        vm.setState({
                            submitting: true,
                        });
                        request.post(`users/profile/avatar`, formData, function (payload, status) {
                            if (status === 200) {
                                vm.setState({ loading: false, success: true, submitting: false, message: 'Profil fotoğrafı yüklendi' });
                                window.location.reload();
                            }
                            else {
                                vm.setState({ loading: false, error: true, submitting: false, message: 'Bir hata oluştu' });
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
                {
                    !image && (
                        <React.Fragment>
                            <br />
                            <label className="fileContainer">
                                Yeni dosya yüklemek için tıklayın
                            <input type="file" className="inputFile" onChange={this.onSelectFile} value="" />

                            </label>
                            <br />
                        </React.Fragment>


                    )
                }

                {
                    image && (
                        <React.Fragment>
                            <AvatarEditor
                                ref={this.setEditorRef}
                                image={image}
                                width={120}
                                height={120}
                                border={20}
                                color={[255, 255, 255, 0.6]} // RGBA
                                scale={parseFloat(this.state.scale)}
                                style={{ width: '50% !important', height: '50% !important', display: 'block' }}
                            />
                            Zoom:
                            <input
                                name="scale"
                                type="range"
                                onChange={this.handleScale}
                                min={this.state.allowZoomOut ? '0.1' : '1'}
                                max="2"
                                step="0.01"
                                defaultValue="1"
                                style={{ display: 'block' }}

                            />

                        </React.Fragment>
                    )
                }
                <Btn className="form-submit" onClick={this.onClickSave} wide light text uppercase big status={vm.state.submitting && 'loading'} disabled={vm.state.submitting}>Güncelle</Btn>
            </React.Fragment>


        )
    }
}
export default MyAvatar
