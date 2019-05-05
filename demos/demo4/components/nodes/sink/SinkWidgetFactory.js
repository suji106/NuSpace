import * as RJD from '../../../../../src/main';
import { OutputNodeWidgetFactory } from './SinkNodeWidget';

export class SinkWidgetFactory extends RJD.NodeWidgetFactory{
  constructor() {
    super('sink');
  }

  generateReactWidget(diagramEngine, node) {
    return OutputNodeWidgetFactory({ node });
  }
}
