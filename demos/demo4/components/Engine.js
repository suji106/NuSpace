import React from 'react';
import * as RJD from '../../../src/main';
import { SinkWidgetFactory } from './nodes/sink/SinkWidgetFactory';
import { OutputNodeFactory } from './nodes/sink/SinkInstanceFactories';
import { SourceWidgetFactory } from './nodes/source/SourceWidgetFactory';
import { InputNodeFactory } from './nodes/source/SourceInstanceFactories';
import { ProcessorWidgetFactory } from './nodes/processor/ProcessorWidgetFactory';
import { ConnectionNodeFactory } from './nodes/processor/ProcessorInstanceFactories';

// Setup the diagram engine
export const diagramEngine = new RJD.DiagramEngine();
diagramEngine.registerNodeFactory(new RJD.DefaultNodeFactory());
diagramEngine.registerLinkFactory(new RJD.DefaultLinkFactory());
diagramEngine.registerNodeFactory(new SinkWidgetFactory());
diagramEngine.registerNodeFactory(new SourceWidgetFactory());
diagramEngine.registerNodeFactory(new ProcessorWidgetFactory());

// Register instance factories
diagramEngine.registerInstanceFactory(new RJD.DefaultNodeInstanceFactory());
diagramEngine.registerInstanceFactory(new RJD.DefaultPortInstanceFactory());
diagramEngine.registerInstanceFactory(new RJD.LinkInstanceFactory());
diagramEngine.registerInstanceFactory(new OutputNodeFactory());
diagramEngine.registerInstanceFactory(new InputNodeFactory());
diagramEngine.registerInstanceFactory(new ConnectionNodeFactory());
