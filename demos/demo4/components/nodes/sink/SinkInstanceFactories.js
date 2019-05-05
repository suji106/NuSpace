import * as RJD from '../../../../../src/main';
import { SinkNodeModel } from './SinkNodeModel';

export class OutputNodeFactory extends RJD.AbstractInstanceFactory {
  constructor() {
    super('SinkNodeModel');
  }

  getInstance() {
    return new SinkNodeModel();
  }
}
