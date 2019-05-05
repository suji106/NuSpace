import * as RJD from '../../../../../src/main';
import { SourceNodeModel } from './SourceNodeModel';

export class InputNodeFactory extends RJD.AbstractInstanceFactory {
  constructor() {
    super('SourceNodeModel');
  }

  getInstance() {
    return new SourceNodeModel();
  }
}
