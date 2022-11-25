class EventNamespaces {
  static eventNamespaces = {};

  static on(event, namespace, fn) {
    // allow on to be used without a namespace set
    if (typeof namespace === "function") {
      fn = namespace;
      namespace = "";
    }
    namespace ??= "";
    this.eventNamespaces[namespace] = {
      ...this.eventNamespaces[namespace],
      [event]: fn,
    };
    this.addEventListener(event, this.eventNamespaces[namespace][event]);
  }

  static off(namespace, event) {
    namespace ??= "";
    if (event === undefined || event === null) {
      // remove the whole namespaces event listeners and delete the namespace from the element
      Object.entries(this.eventNamespaces[namespace]).forEach(([e, fn]) =>
        this.removeEventListener(e, fn)
      );
      delete this.eventNamespaces[namespace];
      return;
    }
    this.removeEventListener(event, this.eventNamespaces[namespace][event]);
    delete this.eventNamespaces[namespace][event];
    if (
      this.eventNamespaces[namespace] &&
      Object.keys(this.eventNamespaces[namespace]) === 0 &&
      Object.getPrototypeOf(this.eventNamespaces[namespace]) ===
        Object.prototype
    ) {
      delete this.eventNamespaces[namespace];
    }
  }
}
window.on = document.on = Element.prototype.on = EventNamespaces.on;
window.off = document.off = Element.prototype.off = EventNamespaces.off;
window.eventNamespaces = document.eventNamespaces = Element.eventNamespaces = EventNamespaces.eventNamespaces;
