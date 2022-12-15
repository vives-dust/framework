# Validation

This dir contains the validation schema's for both input and output of the API. We do make a difference between the public API and the management API.

* Public API: We only use Nano ID's instead of Mongo DB Object ID's.
* Management API: Make's use of Mongo DB Object ID's. On creation of an entity the Nano ID is automatically generated and injected into the instance.
