class Svg extends React.Component {
  render() {
      return <div className="svg" dangerouslySetInnerHTML={{__html: this.props.src }} />;
  }
}