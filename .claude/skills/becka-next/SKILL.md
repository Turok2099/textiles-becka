---
name: becka-next
description: Desarrollar rutas, componentes y datos de Beckatex con Next.js App Router. Usar para cambios funcionales o de arquitectura.
---

Leer CLAUDE.md y package.json antes de cambiar la estructura.
Mantener el contenido de marca compartido en src/lib/site.ts; los módulos específicos pueden tener sus propios archivos tipados.
Usar componentes de servidor por defecto. Aislar estado y eventos en componentes cliente pequeños.
Para rutas nuevas, definir título y descripción; incluir loading o error cuando haya carga remota que lo justifique.
Usar next/link en navegación entre rutas y next/image con dimensiones para fotos del catálogo cuando existan.
Validar entradas en servidor al agregar formularios. Mantener secretos fuera de NEXT_PUBLIC y del repositorio.
No agregar base de datos, autenticación, carrito ni librerías sin una necesidad del encargo.
Al terminar, ejecutar las comprobaciones de /becka-check que correspondan al cambio.

