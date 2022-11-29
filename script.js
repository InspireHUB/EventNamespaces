class EventNamespaces {
  static on(event, namespace, fn) {
    this.eventNamespaces ??= {};
    // allow on to be used without a namespace set
    if (typeof namespace === "function") {
      fn = namespace;
      namespace = null;
    }
    namespace ??= event.split(".")[1] ?? "";
    event = event.split(".")[0];
    this.eventNamespaces[namespace] = {
      ...this.eventNamespaces[namespace],
      [event]: fn,
    };
    this.addEventListener(event, this.eventNamespaces[namespace][event]);
  }

  static off(event = "", namespace) {
    Object.entries(this.eventNamespaces).forEach(([ns, evts]) => {
      if (namespace == undefined || ns === namespace) {
        // TODO: maybe add an optimization later for if event is even in the namespace
        Object.entries(evts).forEach(([e, fn]) => {
          if (event === "" || event === e) {
            this.removeEventListener(e, fn);
            delete this.eventNamespaces[ns][e];
          }
        });
        // clear out empty event namespaces
        if (Object.keys(this.eventNamespaces[ns]).length === 0) {
          delete this.eventNamespaces[ns];
        }
      }
    });
  }
}
window.on = document.on = Element.prototype.on = EventNamespaces.on;
window.off = document.off = Element.prototype.off = EventNamespaces.off;
