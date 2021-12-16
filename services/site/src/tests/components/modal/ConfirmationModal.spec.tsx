import "@testing-library/jest-dom/extend-expect";

import Button from "app/components/buttons/Button";
import ConfirmationModal, { ConfirmationModalProps } from "app/components/modal/ConfirmationModal";
import { Modal } from "app/components/modal/Modal";
import { ModalTitle } from "app/components/modal/ModalTitle";
import { shallow, ShallowWrapper } from "enzyme";
import React from "react";

const mockTitle = "Mock Confirmation Modal Title";
const mockCancelButtonLabel = "Mock Cancel";
const mockOnCancel = jest.fn();
const mockConfirmButtonLabel = "Mock Confirm";
const mockOnConfirm = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

const renderConfirmationModal = (props?: Partial<ConfirmationModalProps>): ShallowWrapper => {
  return shallow(<ConfirmationModal open={true} title={mockTitle} onCancel={mockOnCancel} {...props} />);
};

describe("ConfirmationModal", () => {
  it("renders a closed modal", () => {
    const wrapper = renderConfirmationModal({ open: false });

    expect(wrapper.find(Modal).props().open).toBeFalsy();
  });

  it("renders an open modal", () => {
    const wrapper = renderConfirmationModal({ open: true });

    expect(wrapper.find(Modal).props().open).toBeTruthy();
  });

  it("renders the title", () => {
    const wrapper = renderConfirmationModal({ title: mockTitle });

    expect(wrapper.find(ModalTitle).children().text()).toContain(mockTitle);
  });

  it("renders the default `cancelButtonLabel`", () => {
    const wrapper = renderConfirmationModal();

    expect(wrapper.find(Button).findWhere((n) => n.text() === "Cancel")).toBeTruthy();
  });

  it("renders a custom `cancelButtonLabel`", () => {
    const wrapper = renderConfirmationModal({ cancelButtonLabel: mockCancelButtonLabel });

    expect(wrapper.find(Button).findWhere((n) => n.text() === mockCancelButtonLabel)).toBeTruthy();
  });

  it("renders the default `confirmButtonLabel`", () => {
    const wrapper = renderConfirmationModal();

    expect(wrapper.find(Button).findWhere((n) => n.text() === "Confirm")).toBeTruthy();
  });

  it("renders a custom `confirmButtonLabel`", () => {
    const wrapper = renderConfirmationModal({ confirmButtonLabel: mockConfirmButtonLabel });

    expect(wrapper.find(Button).findWhere((n) => n.text() === mockConfirmButtonLabel)).toBeTruthy();
  });

  it("calls onCancel in onClose of the modal", () => {
    const wrapper = renderConfirmationModal({ onCancel: mockOnCancel });

    wrapper.find(Modal).props().onClose();
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel on `Cancel` press", () => {
    const wrapper = renderConfirmationModal({ cancelButtonLabel: mockCancelButtonLabel, onCancel: mockOnCancel });

    wrapper
      .find(Button)
      .findWhere((n) => n.text() === mockCancelButtonLabel)
      .closest(Button)
      .simulate("click");
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it("calls onConfirm on `Confirm` press", async () => {
    const wrapper = renderConfirmationModal({ confirmButtonLabel: mockConfirmButtonLabel, onConfirm: mockOnConfirm });

    wrapper
      .find(Button)
      .findWhere((n) => n.text() === mockConfirmButtonLabel)
      .closest(Button)
      .simulate("click");
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });
});
