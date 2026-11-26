---
name: bce-certificates
description: "Use when building a 'my certificates' page, a certificate download button on a course or event page, a Certificate Name or certificate details form, a certificate verification page, or group admins' certificate tools (list, export, revoke, reinstate, reissue, issue) on a site running the Bricks Community Certificates module. Also for switching a course's or event's certificate on, setting credit hours, or issuing and correcting certificates through the abilities. Covers the My Certificates and Group certificates loops, the {certificate_*} tags, the certificate conditions, the Certificate Verification template type and the certificate Form actions."
---

# Bricks Community: certificates

**Requires:** the Certificates module (core), which needs Courses or Events on. Group admin tools also need Groups and Content Locking, plus the site setting. Confirm tags with `bricks/list-dynamic-data-tags` and conditions with `bce/list-display-conditions`. Form mechanics: `bricks-forms`.

Certificates issue themselves: finishing a course or being marked attended issues one if the member's **Certificate Name** is filled in, otherwise it waits as **pending**. Your job is the pages around that. The PDF itself is a Certificate Template in wp-admin (HTML/CSS for a PDF renderer), not a Bricks template; no ability writes it.

## Loops

| Query type | Returns |
|---|---|
| **My Certificates (Bricks Community)** | The viewer's own, newest first, pending and revoked included. **Hide pending** control. No user setting, deliberately |
| **Group certificates (Bricks Community)** | One group's members' certificates for content that group was granted. Group ID `{bce_group_id}` inside a Groups loop (empty = enclosing Groups loop). Rows only for that group's admins (when allowed) and site admins; a group admin's own are left out |

## Tags

In a loop row, on the verification page, or on a course/event page (the viewer's own for it, no loop needed): `{certificate_title}` `{certificate_full_name}` `{certificate_status}` (`:key` gives `valid`/`pending`/`revoked`) `{certificate_number}` `{certificate_code}` `{certificate_hours}` `{certificate_completed_date}` `{certificate_issued_date}` (take a date format, `{certificate_issued_date:Y-m-d}`) `{certificate_completed_datetime}` `{certificate_issued_datetime}` `{certificate_timezone}` `{certificate_issuer}` `{certificate_missing}` `{certificate_download_url}` `{certificate_verify_url}` `{certificate_pdf_url}` `{certificate_revoked_reason}`.

Anywhere: `{certificate_name}` (the viewer's Certificate Name) and `{certificate_details_url}`.

- `{certificate_download_url}` is for the holder and managers only; `{certificate_revoked_reason}` for managers only. Both are empty for anyone else.
- There is **no holder email tag**, and none of these is ever a member's email. Don't add one.
- Bricks reserves `:raw`; the status key modifier is `:key`.

## Conditions

`bce_certificate_status` (`none` / `pending` / `valid` / `revoked`, of the certificate in context), `bce_has_certificate_name`, and `bce_can_manage_group_certificates` (a group ID, or empty for the loop's group) on group admin tools.

## Recipes

- **My certificates:** My Certificates loop. Download button → `{certificate_download_url}`, condition status `!=` `pending`. Pending row: "Still needed: `{certificate_missing}`" + link to `{certificate_details_url}`, condition status `==` `pending`. A revoked one still downloads, stamped INVALID; say so on its row.
- **Certificate details form:** a Bricks Form, a text field defaulting to `{certificate_name}`, action **Save certificate details (Bricks Community)** with *Certificate Name* `{{that_field}}` and one *Certificate fields* row per field; prefill a field with `{wp_user_meta:bce_certificate_field_KEY}` (or its own meta key). Own user only. Tell the owner to set this page as the **Certificate details page** (`certificates.details_page` in `bce/update-settings`).
- **Verification page:** a Bricks template of type **Certificate Verification**, with three blocks on `bce_certificate_status`: `valid`, `revoked`, `none` (unknown code, served as 404). Template conditions are ignored: the newest published one is used, on verification pages only. It must never show certificate fields or emails; the tags don't offer them.
- **Group admin tools:** wrap in `bce_can_manage_group_certificates`. Group certificates loop; in each row a hidden field set to `{certificate_code}` feeding **Revoke**, **Reinstate** or **Reissue certificate** (*Certificate code* `{{that_field}}`; Reissue also takes a name prefilled with `{certificate_full_name}`). **Issue certificate**: two Select fields with "Set options as value:label", options `{group_certificate_members}` and `{group_certificate_objects}`. Export button → `{group_certificates_csv_url}`. There is no group ID setting on these actions: the server checks the submitter's groups. A condition with an empty group ID only works **inside** the Groups loop: Bricks checks a looped element's own condition once, outside the loop, so put it on a wrapper inside the loop.

## Abilities

`bce/get-certificate-settings` / `bce/set-certificate-settings` (one course, event or collection: `enabled`, `hours`, `template`, `required`); `bce/list-certificates` (optionally `groupId`); `bce/issue-certificate`, `bce/revoke-certificate` (destructive: confirm with the user first), `bce/reinstate-certificate`, `bce/reissue-certificate` (`refresh` is site admins only). Site-wide settings are `certificates.*` in `bce/get-settings`. Switching a certificate on issues nothing for past completions; issue those by hand.

## Verify

Test the member pages logged in as a plain member with a valid, a pending and a revoked certificate; admins see every download. Test group tools as a group admin (not a site admin) with the setting on, and confirm a plain member sees nothing. Open a verification URL logged out.

Docs: https://grasshopperweb.agency/lessons/certificates-my-certificates/ · https://grasshopperweb.agency/lessons/certificates-group-admin-tools/
