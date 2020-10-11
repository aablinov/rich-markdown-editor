import styled from "styled-components";
const Flex = styled.div `
  display: flex;
  flex: ${({ auto }) => (auto ? "1 1 auto" : "initial")};
  flex-direction: ${({ column }) => (column ? "column" : "row")};
  align-items: ${({ align }) => align};
  justify-content: ${({ justify }) => justify};
`;
export default Flex;
//# sourceMappingURL=Flex.js.map