import uuid from "uuid";

class PanelCable {
  constructor(params) {
    this.id = params.id || uuid.v4();
    this.color = params.color || "red";
    this.components = params.components;
  }
}

class PanelComponent {
  constructor(params) {
    this.id = params.id || uuid.v4();
    this.component = params.component || "Buffer";
    this.level = params.level || 0;
    this.label = params.label || "";
    this.x = params.x || 0;
    this.y = params.y || 0;
  }
}

class PanelConnection {
  constructor(params) {
    this.id = params.id || uuid.v4();
    this.to = params.to || uuid.v4();
    this.from = params.from || uuid.v4();
  }
}

export default class SoftwarePanel {
  constructor(params) {
    this.id = params.id || uuid.v4();
    this.class = "SoftwarePanel";
    this.simulatorId = params.simulatorId || null;
    this.name = params.name || "Panel";
    this.update(params);
  }
  update(panel) {
    this.cables = [];
    this.components = [];
    this.connections = [];
    (panel.cables || []).forEach(c => this.cables.push(new PanelCable(c)));
    (panel.components || []).forEach(c =>
      this.components.push(new PanelComponent(c))
    );
    (panel.connections || []).forEach(c =>
      this.connections.push(new PanelConnection(c))
    );
  }
}
