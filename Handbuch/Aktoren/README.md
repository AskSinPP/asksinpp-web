# Aktoren entwickeln

::: warning Geplanter Bereich
Diese Seite ist ein Platzhalter. Geplant sind Schaltkanäle, Zustandsmaschinen, lokale Bedienung, Direktverknüpfungen sowie zeitgesteuertes Ein- und Ausschalten. Dimmer und Rollladenaktoren folgen als Vertiefung.
:::

Als Lernbeispiel ist ein Gerät mit zwei Schaltkanälen vorgesehen. Es verbindet `SwitchChannel`, interne Taster und Peers. Die Erklärung der Firmware kann an LEDs oder einem geeigneten Niedervolt-Aufbau nachvollzogen werden.

Quellen: `Channel.h` (`ActorChannel`), `Switch.h` (`SwitchChannel`, `SwitchStateMachine`), `StateMachine.h`, `Dimmer.h` und `Blind.h` am [festgelegten Quellstand](../Referenz/README.md). Vorhandenes Hintergrundwissen: [LED-Dimmer-Grundlagen](/Grundlagen/FAQ/LED_Grundlagen.html).
