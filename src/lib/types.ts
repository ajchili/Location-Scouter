import { Coords } from 'google-map-react';

export interface BasicMapComponentProps extends Coords {}

export interface MapElement extends BasicMapComponentProps {
  id: string;
  name: string;
}
