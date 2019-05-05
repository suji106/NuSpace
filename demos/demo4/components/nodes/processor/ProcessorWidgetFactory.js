import * as RJD from '../../../../../src/main';
import { ConnectionNodeWidgetFactory } from './ProcessorNodeWidget';

export class ProcessorWidgetFactory extends RJD.NodeWidgetFactory{
  constructor() {
    super('processor');
  }

  generateReactWidget(diagramEngine, node) {
    return ConnectionNodeWidgetFactory({ node });
  }
}
