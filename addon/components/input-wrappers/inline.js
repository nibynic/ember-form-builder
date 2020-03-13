import classic from 'ember-classic-decorator';
import { layout as templateLayout } from '@ember-decorators/component';
import Component from '@ember/component';
import layout from '../../templates/components/input-wrappers/inline';

@classic
@templateLayout(layout)
export default class Inline extends Component {}
