import * as React from 'react'

import {
  Body,
  Container,
  Head,
  Heading,
  Img,
  Html,
  Link,
  Preview,
  Text
} from '@react-email/components'

export default function MagicLinkEmail({ url, host }) {
  
  return (
    
    <Html>
      <Head />
      <Preview>Welcome To CamRa!</Preview>
      <Body style={main}>
        <Container style={container}>
          <img
            src="https://i.imgur.com/ja0ROVc.png"
            alt="CamRa logo"
            width="600"  
            style={{
              marginBottom: '24px',
              marginTop: '-24px'
            }}
          />
          <Heading style={h1}> Welcome to CamRa! We're excited to have you join our community. To complete your registration, please verify your email address.{host}</Heading>
          <Link
            href={`https://${url}`}
            target='_blank'
            style={{
              ...link,
              display: 'block',
              marginBottom: '16px'
            }}
          >
            Click here to verify your CamRa account.
          </Link>

          <Text
            style={{
              ...text,
              color: '#ababab',
              marginTop: '14px',
              marginBottom: '16px'
            }}
          >
            If you didn&apos;t try to login, you can safely ignore this email.
          </Text>

          {/* <Text style={footer}>
            <Link
              href='https://www.camra.me/'
              target='_blank'
              style={{ ...link, color: '#898989' }}
            >
              camra.me
            </Link>
          </Text> */}
          <img
            src="https://i.imgur.com/W3O5NIr.png"
            alt="CamRa logo"
            width="600" // Adjust the width as needed
            style={{
              marginBottom: '24px',
              marginTop: '-24px'
            }}
          />
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#ffffff'
}

const container = {
  paddingLeft: '12px',
  paddingRight: '12px',
  margin: '0 auto'
}

const h1 = {
  color: '#333',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '24px',
  fontWeight: 'bold',
 
  padding: '0'
}

const link = {
  color: '#2754C5',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: '24px',
    fontWeight: 'bold',
  textDecoration: 'underline'
}

const text = {
  color: '#333',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '18px',
  // margin: '24px 0'
}

const footer = {
  color: '#898989',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '12px',
  lineHeight: '22px',
  marginTop: '12px',
  marginBottom: '24px'
}

const code = {
  display: 'inline-block',
  padding: '16px 4.5%',
  width: '90.5%',
  backgroundColor: '#f4f4f4',
  borderRadius: '5px',
  border: '1px solid #eee',
  color: '#333'
}