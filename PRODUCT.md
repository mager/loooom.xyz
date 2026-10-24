# Loooom

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

People who publish personal agent context and reusable skills. Skill authors who want to test changes before use.

## Product Purpose

Publish ME.md context, discover agent skills, and inspect evidence from skill evaluations.

## Operating Context

The Skills gym runs locally in the loooom CLI repository. The website shows saved reports. The first runner uses the user's signed-in Codex CLI. Skill text stays agent-agnostic.

## Capabilities and Constraints

Repair a skill using observed training failures, or remove sections and test the shorter version. Use fixed criteria and a holdout case. Keep original and candidate content, hashes, responses, and decisions. A small passing suite is not proof of general improvement. This loop does not train model weights.

## Evidence on Hand

The absorb and focus source files are pinned to website commit aa4dcee816171f8483ccd46dac55e5c8ce7d5287. Report files contain measured model outputs. Deliberately introduced defects must be labeled as controlled tests.

## Product Principles

- Show evidence beside scores.
- Keep the original version available.
- Make local experiments easy to repeat.
- Distinguish observed failures from introduced defects.
