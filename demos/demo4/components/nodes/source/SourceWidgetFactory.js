import * as RJD from '../../../../../src/main';
import { InputNodeWidgetFactory } from './SourceNodeWidget';

export class SourceWidgetFactory extends RJD.NodeWidgetFactory{
  constructor() {
    super('source');
  }

  generateReactWidget(diagramEngine, node) {
    return InputNodeWidgetFactory({ node });
  }
}
