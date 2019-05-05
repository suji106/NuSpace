import * as RJD from '../../../../../src/main';
import { ProcessorNodeModel } from './ProcessorNodeModel';

export class ConnectionNodeFactory extends RJD.AbstractInstanceFactory {
  constructor() {
    super('ProcessorNodeModel');
  }

  getInstance() {
    return new ProcessorNodeModel();
  }
}
