import classic from 'ember-classic-decorator';
import { layout as templateLayout } from '@ember-decorators/component';
import Component from '@ember/component';
import layout from '../../templates/components/input-wrappers/default';

@classic
@templateLayout(layout)
export default class Default extends Component {}
