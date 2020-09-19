export interface BasicMapComponentProps extends google.maps.LatLngLiteral {}

export interface MapElement extends BasicMapComponentProps {
  id: string;
  name: string;
}
