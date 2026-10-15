---
name: becka-check
description: Validar cambios de código en Textiles Becka antes de entregar y diagnosticar fallos de compilación, tipos o calidad.
---

Revisar el cambio y ejecutar npm run lint, npm run typecheck y npm run build para cambios de aplicación.
Si falla una comprobación, corregir la causa dentro del alcance y repetir la comprobación afectada.
Para cambios visuales, iniciar npm run dev y revisar escritorio y móvil si hay navegador disponible.
Comprobar navegación, enlaces y cualquier interacción cambiada. Distinguir inspección de código, respuesta HTTP y revisión visual real.
No añadir pruebas que solo reproduzcan la implementación. Añadirlas cuando exista lógica o un comportamiento que merezca protección.
No ejecutar instalaciones forzadas ni actualizar dependencias en bloque para ocultar fallos.
Reportar qué pasó, qué comprobaciones terminaron correctamente y cualquier limitación pendiente.

