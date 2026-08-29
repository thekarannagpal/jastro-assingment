import React, { useState } from 'react';
import type { AIProposalResult, AIProposalItem, ViewportScope } from '../types/template';
import { Check, X, Sparkles, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';

interface ProposalReviewModalProps {
  proposal: AIProposalResult;
  onClose: () => void;
  onApplyAccepted: (acceptedItems: AIProposalItem[], scope: ViewportScope) => void;
}

export const ProposalReviewModal: React.FC<ProposalReviewModalProps> = ({
  proposal,
  onClose,
  onApplyAccepted,
}) => {
  const [items, setItems] = useState<AIProposalItem[]>(proposal.items);

  const toggleItemStatus = (elementId: string, status: 'accepted' | 'rejected') => {
    setItems((prev) =>
      prev.map((item) =>
        item.elementId === elementId
          ? { ...item, status: item.status === status ? 'pending' : status }
          : item
      )
    );
  };

  const handleAcceptAll = () => {
    setItems((prev) => prev.map((item) => ({ ...item, status: 'accepted' })));
  };

  const handleRejectAll = () => {
    setItems((prev) => prev.map((item) => ({ ...item, status: 'rejected' })));
  };

  const acceptedCount = items.filter((i) => i.status === 'accepted').length;

  const handleCommit = () => {
    const acceptedItems = items.filter((i) => i.status === 'accepted');
    onApplyAccepted(acceptedItems, proposal.viewportScope);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="proposal-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="AI Proposal Review Modal">
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="sparkle-icon-circle">
              <Sparkles size={20} className="text-cyan-400" />
            </div>
            <div>
              <h3>AI Proposal Review & Approval</h3>
              <span className="modal-subtitle">
                Prompt: "{proposal.prompt}" • Target Scope: <strong>{proposal.viewportScope.toUpperCase()}</strong>
              </span>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Error / Failure Banner */}
        {!proposal.success && (
          <div className="proposal-error-box">
            <AlertTriangle size={20} className="text-rose-400 shrink-0" />
            <div>
              <h4 className="error-title">Safe Failure Triggered</h4>
              <p className="error-body">{proposal.error}</p>
              <p className="error-note">No changes made to template state.</p>
            </div>
          </div>
        )}

        {/* Successful Proposal Items List */}
        {proposal.success && (
          <>
            <div className="proposal-toolbar">
              <div className="accepted-summary">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span>
                  <strong>{acceptedCount}</strong> of {items.length} proposed element change{items.length > 1 ? 's' : ''} accepted
                </span>
              </div>
              <div className="toolbar-actions">
                <button className="toolbar-btn accept-all-btn" onClick={handleAcceptAll}>
                  <Check size={14} />
                  <span>Accept All</span>
                </button>
                <button className="toolbar-btn reject-all-btn" onClick={handleRejectAll}>
                  <X size={14} />
                  <span>Reject All</span>
                </button>
              </div>
            </div>

            <div className="proposal-items-list">
              {items.map((item) => {
                const isAccepted = item.status === 'accepted';
                const isRejected = item.status === 'rejected';

                return (
                  <div
                    key={item.elementId}
                    className={`proposal-item-card ${isAccepted ? 'accepted-card' : ''} ${isRejected ? 'rejected-card' : ''}`}
                  >
                    <div className="item-card-header">
                      <div className="item-meta">
                        <span className="item-name">{item.elementName}</span>
                        <span className="item-id">#{item.elementId}</span>
                      </div>
                      <div className="item-toggle-buttons">
                        <button
                          className={`item-toggle-btn accept ${isAccepted ? 'active' : ''}`}
                          onClick={() => toggleItemStatus(item.elementId, 'accepted')}
                          title="Accept changes for this element"
                        >
                          <Check size={14} />
                          <span>Accept</span>
                        </button>
                        <button
                          className={`item-toggle-btn reject ${isRejected ? 'active' : ''}`}
                          onClick={() => toggleItemStatus(item.elementId, 'rejected')}
                          title="Reject changes for this element"
                        >
                          <X size={14} />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>

                    <div className="item-reasoning">
                      💡 <strong>AI Reasoning:</strong> {item.reasoning}
                    </div>

                    {/* Before / After Side-by-Side Diff */}
                    <div className="before-after-diff-grid">
                      <div className="diff-col before-col">
                        <div className="col-header">BEFORE SNAPSHOT</div>
                        <pre className="diff-pre">
                          {JSON.stringify(
                            {
                              content: item.beforeSnapshot.content,
                              style: item.beforeSnapshot.style,
                            },
                            null,
                            2
                          )}
                        </pre>
                      </div>

                      <div className="diff-arrow-divider">
                        <ArrowRight size={18} className="text-slate-500" />
                      </div>

                      <div className="diff-col after-col">
                        <div className="col-header">PROPOSED CHANGES ({proposal.viewportScope.toUpperCase()})</div>
                        <pre className="diff-pre text-cyan-300">
                          {JSON.stringify(item.proposed, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="modal-footer">
              <button className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button
                className="commit-apply-btn"
                onClick={handleCommit}
                disabled={acceptedCount === 0}
              >
                Apply {acceptedCount} Accepted Change{acceptedCount !== 1 ? 's' : ''}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
