import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Aviso de privacidad",
  description: `Cómo ${site.name} recaba, usa y protege tus datos personales, y cómo ejercer tus derechos ARCO.`,
  path: "/aviso-de-privacidad",
});

export default function PrivacyPage() {
  const { legal, contact } = site;
  return (
    <div>
      <a className="skip-link" href="#contenido">Ir al contenido</a>
      <SiteHeader />
      <main id="contenido" className="legal">
        <div className="wrap legal-inner">
          <h1>Aviso de privacidad</h1>
          <p className="legal-date">Última actualización: {legal.updated}</p>

          <h2>1. Responsable</h2>
          <p>
            {legal.responsible}, que opera bajo el nombre comercial {site.name} (en adelante, “BKTX”), es responsable del
            tratamiento de los datos personales que se recaban a través de este sitio web, del formulario de contacto y de los
            mensajes que nos envías por correo, teléfono o WhatsApp, conforme a la Ley Federal de Protección de Datos
            Personales en Posesión de los Particulares y su normativa aplicable.
          </p>
          <address>
            Domicilio para oír y recibir notificaciones:<br />
            {legal.address.map((line) => <span key={line}>{line}<br /></span>)}
            Correo: <a href={`mailto:${legal.email}`}>{legal.email}</a>
          </address>

          <h2>2. Datos personales que recabamos</h2>
          <p>Según cómo te comuniques con nosotros, podemos recabar:</p>
          <ul>
            <li>Nombre.</li>
            <li>Correo electrónico.</li>
            <li>Número de teléfono o de WhatsApp.</li>
            <li>El contenido de tu mensaje y los detalles que nos compartas sobre tu pedido (por ejemplo, logotipos, tallas o cantidades).</li>
            <li>Datos técnicos de navegación, como dirección IP, tipo de dispositivo y páginas visitadas, mediante herramientas de analítica web.</li>
          </ul>
          <p>
            No solicitamos datos personales sensibles (como salud, origen étnico, religión o ideología). Este sitio no está
            dirigido a menores de edad; si un pedido involucra uniformes escolares, la persona que nos contacta debe ser una
            persona adulta.
          </p>

          <h2>3. Finalidades del tratamiento</h2>
          <p><strong>Necesarias para atender tu solicitud:</strong></p>
          <ul>
            <li>Responder tus mensajes y dudas.</li>
            <li>Enviarte información, cotizaciones y catálogo de nuestros productos y servicios.</li>
            <li>Dar seguimiento a tu pedido y a la entrega, en su caso.</li>
          </ul>
          <p><strong>Adicionales:</strong></p>
          <ul>
            <li>Elaborar estadísticas del uso del sitio para mejorar su contenido y funcionamiento.</li>
          </ul>
          <p>
            Si no quieres que tus datos se usen para las finalidades adicionales, escríbenos a{" "}
            <a href={`mailto:${legal.email}`}>{legal.email}</a>; esto no afectará la atención de tu solicitud.
          </p>

          <h2>4. Transferencias y proveedores</h2>
          <p>
            No vendemos ni compartimos tus datos personales con terceros para fines propios de ellos. Para operar el sitio
            nos apoyamos en proveedores de servicios que procesan información por nuestra cuenta, como el servicio de envío
            de correo del formulario de contacto, el alojamiento del sitio, el almacenamiento de imágenes y, cuando está
            activa, la analítica web de Google. Si usas WhatsApp, Instagram o TikTok para escribirnos, esas plataformas
            tratan tus datos conforme a sus propios avisos de privacidad.
          </p>

          <h2>5. Cookies y tecnologías de rastreo</h2>
          <p>
            Cuando la analítica web está activa, se pueden usar cookies para conocer, de forma estadística, cómo se usa el
            sitio. Puedes desactivarlas o eliminarlas desde la configuración de tu navegador; el sitio sigue funcionando sin
            ellas.
          </p>

          <h2>6. Derechos ARCO y revocación del consentimiento</h2>
          <p>
            Tienes derecho a Acceder a tus datos, Rectificarlos si son inexactos, Cancelarlos y Oponerte a su tratamiento
            (derechos ARCO), así como a revocar tu consentimiento. Para ejercerlos, envía tu solicitud a{" "}
            <a href={`mailto:${legal.email}`}>{legal.email}</a> o entrégala en el domicilio indicado, incluyendo:
          </p>
          <ul>
            <li>Tu nombre y un medio para responderte.</li>
            <li>Un documento que acredite tu identidad (o la de tu representante).</li>
            <li>La descripción clara del derecho que quieres ejercer y de los datos involucrados.</li>
          </ul>
          <p>Te responderemos a través del medio que nos indiques, dentro de los plazos que marca la ley.</p>

          <h2>7. Medidas de seguridad</h2>
          <p>
            Aplicamos medidas administrativas, técnicas y físicas razonables para proteger tus datos contra daño, pérdida,
            alteración o acceso no autorizado.
          </p>

          <h2>8. Cambios a este aviso</h2>
          <p>
            Podemos actualizar este aviso por cambios legales o en nuestra forma de operar. La versión vigente siempre estará
            en esta página, con su fecha de actualización.
          </p>

          <h2>9. Contacto</h2>
          <p>
            Para cualquier duda sobre este aviso escríbenos a <a href={`mailto:${legal.email}`}>{legal.email}</a> o llámanos al{" "}
            <a href={contact.phone.href}>{contact.phone.label}</a>.
          </p>
        </div>
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </div>
  );
}
