import React from "react";
import styled from 'styled-components';

const Wip = styled.div`
  font-size: 16px;
  line-height: 24px;
  border: 2px solid #00000030;
  border-radius: 4px;
  padding: 10px 20px;
  margin: 0 auto 40px auto;
`;

export default () => {
  return <Wip>
    This site is under construction. Sorry for those things that look wrong.
  </Wip>
};
