import { css } from "@emotion/react";

export const buttonStyle = css`
  padding: 0.25rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  color: white;
  font-family: inherit;

  height: 100%;
  font-size: 1.25rem;
  font-weight: 900;
  text-transform: uppercase;
  text-align: center;
  background-color: deepskyblue;
  letter-spacing: 1px;

  @media screen and (max-width: 768px) {
    font-size: 1rem;
  }

  & + & {
    margin-left: 1rem;
  }

  &:hover {
    cursor: pointer;
  }

  &.stop {
    background-color: deeppink;
  }
`;
