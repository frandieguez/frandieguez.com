import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

class AboutPage extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title="About" />

        <img alt="Fran Dieguez" class="alignleft" src="http://www.mabishu.com/wp-content/uploads/2009/10/859795_10200638722191374_162643047_o-300x300.jpg" width="300" height="300" />

        <p>
          Hi! I'm <strong>Fran Diéguez</strong>  and I've been developing web applications as a Full Stack Developer since 2006, and from 2014 as <strong>Head of Research and Development at OpenHost</strong>. I've being using different technologies over the time, ranging from Ruby, to PHP, Node.js and roughtly with Golang on Microservices in the server, and AngularJS in the browser. Later years I've being proudly creating different tools focused in high performance and heavy loaded systems that help journalists to maintain online newspapers, <a href="http://www.opennemas.com/">OpenNemas</a>.
        </p>

        <p>
          For a long time my main focus was web performance <a href="https://github.com/frandieguez">engineering</a> and open source technology.
        </p>

        <p>
          Prior to focusing on online newspapers I've been working as a open-source software consultant at the University of Santiago de Compostela, where I've <strong>developed a custom Linux-based desktop</strong> in order to simplify administrative tasks and also doing massive migrations to open source sofware in educational settings. This project <a href="http://www.mancomun.org/es/no_cache/actualidade/detalledenova/nova/a-osl-da-usc-gana-o-premio-eganet-2009-na-categoria-software-libre/">won the Libre Software contest</a> in Galicia, Spain.
        </p>

        <p>
          Whenever not thinking on web development, or newspapers, I can be found contributing to <a href="https://www.ohloh.net/accounts/frandieguez">open-source projects</a> like <strong>GNOME</strong> (as a member of the GNOME Foundation) or in Ubuntu as Galician translators coordinator, <a href="https://www.amazon.com/gp/pdp/profile/A362F32UBZHEUR">reading</a> or doing sports.
        </p>

        <p>
          Currently I'm <strong>not available for hire</strong> but you can write me to propose me future and innovative projects.
        </p>

      </Layout>
    )
  }
}

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`

export default AboutPage
