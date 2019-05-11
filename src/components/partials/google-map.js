import React from 'react';

//Deps
import defaults from "data/config"
import { loadScript, isDefined, uid } from 'functions/helpers'
import isEqual from "lodash/isEqual";
import extend from "lodash/extend";
import { connect } from "react-redux";

const mapStateToProps = state => {
	return {
		windowWidth: state.generic.windowWidth,
	};
};

class GoogleMap extends React.PureComponent{
	constructor(props) {
		super(props);

		this.state = {
			loading: true,
		}

		this.mapContainer = React.createRef();

		this.settings = {
			maxZoom: 13,
			zoom: 7,
			lat:39.4251863,
			lng:35.2107457,
			markerIcon: false,
			fullScreen: false,
			cluster: false,
			mapTypeControl: false,
			mapOpts: false,
		};
		
		this.mapInstance = null;
		this.markers = {};
		this.bounds = false;
		this.initialized = false;

		this.init = this.init.bind(this);
		this.checkLoad = this.checkLoad.bind(this);
		this.updateMarkers = this.updateMarkers.bind(this);
		this.clearMarkers = this.clearMarkers.bind(this);
		this.addMarker = this.addMarker.bind(this);
		this.removeMarker = this.removeMarker.bind(this);
		this.fit = this.fit.bind(this);
		this.resize = this.resize.bind(this);
		this.destroy = this.destroy.bind(this);

		this.settings = extend(this.settings, this.props.settings);
	}

	componentDidMount() {
		if(!isDefined(window.google) || !isDefined(window.google.maps)){
			loadScript("//maps.googleapis.com/maps/api/js?key="+defaults.mapsAPIkey, this.checkLoad);
		}
		else{
			this.init();
		}
	}

	componentWillUnmount() {
		let vm = this;
		if(vm.mapInstance !== null){
			vm.destroy();
			vm.mapInstance = null;
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if(this.initialized){
			if(!isEqual(prevProps.markers, this.props.markers)){
				this.updateMarkers();
			}

			if(isEqual(prevProps.windowWidth !== this.props.windowWidth)){
				this.resize();
			}
		}
	}

	checkLoad() {
		let vm = this;
		if(isDefined(window.google)){
			vm.init();
		}
		else{
			setTimeout(function() {
				vm.checkLoad();
			}, 50);
		}
	}

	updateMarkers() {
		let vm = this;

		if(Object.keys(vm.markers).length){
			vm.clearMarkers();
		}

		if(vm.props.markers.length){
			for(let k in vm.props.markers){
				vm.addMarker(vm.props.markers[k]);

				//console.log(vm.props.markers[k]);
			}
		}

		vm.fit();
	}

	addMarker(markerOpts) {
		let vm = this;

		let defaultOpts = {
			id: false,
			lat: 10,
			lng: 10,
			title: false,
			html: false,
			icon: {
				strokeWeight: 0,
				scale: 1,
				anchor: new window.google.maps.Point(30, 30),
				scaledSize: new window.google.maps.Size(60,60),
				url: "/assets/images/map-marker.svg",
			}
		}
		let opts = extend(defaultOpts, markerOpts);

		let markerID = (opts.id ? opts.id : uid('googlemaps_marker'));

		let markerInstance = new window.google.maps.Marker({
			map: vm.mapInstance,
			position: {
				lat: opts.lat,
				lng: opts.lng,
			},
			icon: opts.icon
		});

		vm.markers[markerID] = {
			instance: markerInstance
		}
		vm.bounds.extend(markerInstance.position);
	}

	clearMarkers() {
		for(let key in this.markers) { 
			this.removeMarker(key);
		}
	}

	removeMarker(key) {
		this.markers[key].instance.setMap(null);
		delete this.markers[key];
	}

	fit(boundList) {
		let vm = this;

		if(isDefined(boundList)){
			vm.bounds = new window.google.maps.LatLngBounds();
			for(var k = 0; k<boundList.length; k++){
				vm.bounds.extend(boundList[k].position);
			}
		}

		vm.mapInstance.fitBounds(vm.bounds);
		var listener = window.google.maps.event.addListener(vm.mapInstance, "idle", function() {
			if (vm.mapInstance.getZoom() > vm.settings.maxZoom) vm.mapInstance.setZoom(vm.settings.maxZoom);
			window.google.maps.event.removeListener(listener);
		});

		vm.resize();
	}

	destroy() {

	}

	resize() {
		if(this.initialized){
			window.google.maps.event.trigger(this.mapInstance, "resize");
		}
	}

	init() {
		let vm = this;
		vm.mapInstance = new window.google.maps.Map(vm.mapContainer.current, {
			center: {
				lat: vm.settings.lat,
				lng: vm.settings.lng,
			},
			zoom: vm.settings.zoom,
			styles: defaults.mapsTheme,
			mapTypeControl: false,
			fullscreenControl: false,
		});

		vm.bounds = new window.google.maps.LatLngBounds();
		vm.updateMarkers();

		vm.setState({loading: false});
		vm.initialized = true;
	}

	render() {
		let vm = this;
		
		return (
			<div className={"google-map" + (vm.state.loading || vm.props.loading ? ' loading' : '') + (vm.props.className ? ' '+vm.props.className : '')}>
				<div className="map-container" ref={vm.mapContainer}></div>
			</div>
		);
	}
}

GoogleMap.defaultProps = {
	markers: [],
	className: false,
	loading: false,
	markerIcon: false,
	settings: {},
};

export default connect(mapStateToProps)(GoogleMap);