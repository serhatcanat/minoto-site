import React from 'react'
// Deps
import { redirect } from 'controllers/navigator'


export default class BlogRedirect extends React.Component {

    componentDidMount() {
        redirect('blogDetail', { slug: this.props.match.params.slug })
    }

    render() {

        return (
            <React.Fragment>Hello</React.Fragment>
        )
    }
}

