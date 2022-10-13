import React from 'react'
import styled from 'styled-components'

import { useTokenListState } from '../../../state/tokenList/hooks'
import { UnregisteredToken } from '../UnregisteredToken'

const Wrapper = styled.div<{ size: string }>`
  background-color: #606467;
  border-radius: 50%;
  border-width: ${({ size }) => (parseInt(size, 10) < 20 ? '1px' : '3px')};
  border-style: solid;
  border-color: #001429;
  box-sizing: content-box;
  flex-shrink: 0;
  height: ${({ size }) => size};
  overflow: hidden;
  width: ${({ size }) => size};
`

const Image = styled.img`
  background: #fff;
  border-radius: 50%;
  display: block;
  height: 100%;
  width: 100%;
`

interface TokenLogoProps {
  token: { address: string; symbol?: string }
  size?: string
}

const TokenLogo: React.FC<TokenLogoProps> = (props) => {
  const { size = '24px', token, ...restProps } = props
  const { symbol } = token
  const { tokens } = useTokenListState()
  const imageURL = tokens['0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5']

  return imageURL ? (
    <Wrapper className="tokenLogo" size={size} {...restProps}>
      <Image src={imageURL} />
    </Wrapper>
  ) : (
    <UnregisteredToken size={size} symbol={symbol} {...restProps} />
  )
}

export default TokenLogo
