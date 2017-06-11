import App from '../../app.js';

export const EngineQueries = {
  engines(root, { simulatorId }) {
    return App.systems.filter(system => {
      return system.type === 'Engine' && system.simulatorId === simulatorId;
    });
  },
};

export const EngineMutations = {
  createEngine(root, {simulatorId, name, speeds, heatRate}) {
    App.handleEvent({ simulatorId, name, speeds, heatRate }, 'createEngine');
  },
  removeEngine(root, {id, simulatorId, name}) {
    App.handleEvent({ id, simulatorId, name }, 'removeEngine');
  },
  setSpeed(root, { id, speed, on }) {
    App.handleEvent({ id, speed, on }, 'speedChange');
    return '';
  },
  // This mutation applies to all systems
  addHeat(root, { id, heat }) {
    App.handleEvent({ id, heat }, 'addHeat');
    return '';
  },
  engineCool(root, args) {
    App.handleEvent(args, "engineCool");
  }
};

export const EngineSubscriptions = {
  speedChange(rootValue) {
    return rootValue;
  },
  heatChange(rootValue) {
    return rootValue;
  },
};